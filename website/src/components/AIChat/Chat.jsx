import '@generated/client-modules';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useColorMode } from '@docusaurus/theme-common';
import MarkdownRenderer from './MarkdownRenderer';
import { Send, X } from 'lucide-react';
import posthog from 'posthog-js';
import Feedback from './feedback';
import URLS from './id2url.json'


const fadeInStyle = {
  animation: 'fadeIn 0.5s',
};

function splitTextIntoParts(text) {
  if (!text) return [];
  const regex = /(```[\s\S]*?```)/g;
  return text.split(regex).filter((part) => part !== '');
}

function convertIds(text) {
  const regex = /{(\w+)\s*:\s*\[\s*(file_\w+(?:\s*,\s*file_\w+)*)?\s*\]}/g;
  const match = regex.exec(text);
  if (!match) return '';
  const key = match[1];             
  const files = match[2]?.split(/,\s*/) || [];
  return files.map((file) => {
    const url = URLS[file];
    return url ? `- [${url}](${url})\n` : '';
  }).join('');
}

export const Chat = ({ toggleChat }) => {
  const { colorMode } = useColorMode();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const [threadId, setThreadId] = useState(null);
  const [seconds, setSeconds] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingTextLatestChunk, setStreamingTextLatestChunk] = useState('');
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const isDarkTheme = colorMode === 'dark';

  useEffect(() => {
    if (streamingTextLatestChunk && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamingTextLatestChunk]);

  useEffect(() => {
    if (!isStreaming && streamingText) {
      console.log("text", streamingText);
      
      const idsUrl = convertIds(streamingText);
      const regex = /\{ids\s*:\s*\[[^\]]*\]\}/gi;
      const answer = streamingText.replace(regex, '').trim();
      const text = `${answer} \n\nFind more information here:\n\n ${idsUrl}`;

      const aiMessage = { id: Date.now() + 1, text, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setStreamingText('');
      setStreamingTextLatestChunk('');
    }
  }, [isStreaming]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
  }, [colorMode]);

  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else {
      setSeconds(1);
    }

    return () => clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        toggleChat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleChat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        toggleChat();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleChat]);

  const stopStreaming = (stream) => {
    if (stream) stream.close();
    setIsStreaming(false);
  };

  const startStreaming = async (userMessage) => {
    setIsStreaming(true);

    const response = await axios.post(
      'http://localhost:5000/api/chat/initiateChatSession',
      {
        messages: userMessage,
        threadId: threadId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const { threadId: newThreadId, runId } = response.data;
    setThreadId(newThreadId);

    const eventSource = new EventSource(
      `http://localhost:5000/api/chat/stream/${newThreadId}/${runId}`,
    );

    eventSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const eventType = data.event;

      switch (eventType) {
        case 'thread.message.delta':
          if (!data?.data?.delta?.content) return;
          const content = data.data.delta.content;

          if (content.length === 0 || !content[0]?.text?.value) return;
          const latestChunk = data.data.delta.content[0].text.value;
          setStreamingText((prevText) => prevText + latestChunk);
          setStreamingTextLatestChunk(latestChunk);

          setTimeout(() => { }, 0);
          break;

        case 'thread.message.completed':
          setIsStreaming(false);
          break;
        case 'thread.run.completed':
        case 'thread.run.error':
        case 'thread.run.canceled':
        case 'thread.run.expired':
        case 'thread.run.requires_action':
          stopStreaming(eventSource);
          break;
      }
    });

    eventSource.onerror = (error) => {
      console.log('SSE error:', error);
      eventSource.close();
      setIsStreaming(false);
    };

    return () => {
      eventSource.close();
    };
  };

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;
    const userMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    try {
      await startStreaming(inputMessage);
    } catch (error) {
      const aiMessage = {
        id: Date.now() + 1,
        text: 'I was not able to process your request, please try again',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }
  }, [inputMessage, startStreaming]);

  const handleFeedback = useCallback((choice) => {
    posthog.capture('ai_chat_feedback', {
      helpful: choice,
      user_question: messages[messages.length - 2]?.text,
      ai_answer: messages[messages.length - 1]?.text,
    });
  }, [messages]);

  const renderedMessages = useMemo(() =>
    messages.map((msg, idx) => (
      <div
        key={msg.id}
        className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}${idx === messages.length - 1 ? ' latest-message' : ''}`}
        style={fadeInStyle}
        role="listitem"
        aria-label={msg.sender === 'user' ? 'User message' : 'AI message'}
      >
        {splitTextIntoParts(msg.text).map((part, index) => (
          <MarkdownRenderer part={part} isDarkTheme={isDarkTheme} key={index} />
        ))}
        {msg.sender === 'ai' && <Feedback id={msg.id} handler={handleFeedback} />}
      </div>
    ))
  , [messages, isDarkTheme, handleFeedback]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="floating-chat-container" role="dialog" aria-modal="true" aria-label="AI Chat">
      <Card className="chat-card" ref={chatRef}>
        <Card.Header className="chat-header">
          <div className="chat-title">
            <i className="bi bi-robot me-2" aria-hidden="true"></i>
            Docs AI (Beta)
          </div>
          <X className="close-button" onClick={toggleChat} aria-label="Close chat" />
        </Card.Header>

        <Card.Body className="chat-body">
          <div className="messages-container" role="list">
            {messages.length === 0 ? (
              <div className="welcome-message" style={fadeInStyle}>How can I help you today?</div>
            ) : (
              renderedMessages
            )}
            {streamingText && (
              <div className="message ai-message streaming latest-message" style={fadeInStyle} role="listitem" aria-label="AI is responding">
                {splitTextIntoParts(streamingText).map((part, index) => (
                  <MarkdownRenderer part={part} isDarkTheme={isDarkTheme} key={index} />
                ))}
              </div>
            )}
            {isStreaming && !streamingText && (
              <div className="message ai-message loading latest-message" style={fadeInStyle} role="status" aria-live="polite">
                Thinking... ({seconds}s)
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card.Body>

        <Card.Footer className="chat-footer">
          <Form onSubmit={handleSendMessage} autoComplete="off">
            <InputGroup>
              <Form.Control
                className="input-message"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                ref={inputRef}
                disabled={isStreaming}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isStreaming && inputMessage.trim()) {
                      handleSendMessage(e);
                    }
                  }
                }}
              />
              <Button variant="primary" type="submit" disabled={!inputMessage.trim() || isStreaming} aria-label="Send message">
                <Send size={16} />
              </Button>
            </InputGroup>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
};
