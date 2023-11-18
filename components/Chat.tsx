import { useEffect, useState } from 'react';
import styles from '@/components/Chat.module.css';
import axios from 'axios';
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  IconLookup,
  IconDefinition,
  findIconDefinition,
} from '@fortawesome/fontawesome-svg-core';
import LoadingSpin from './LoadingSpin';
library.add(fas);
const circleChevronRight: IconLookup = {
  prefix: 'fas',
  iconName: 'circle-chevron-right',
};
const circleChevronRightIconDefinition: IconDefinition =
  findIconDefinition(circleChevronRight);
const chevronRight: IconLookup = {
  prefix: 'fas',
  iconName: 'chevron-right',
};
const chevronRightIconDefinition: IconDefinition =
  findIconDefinition(chevronRight);

type QnAObject = {
  question: string;
  answer: string;
};

function Chat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);
  const [qnAObjects, setQnAObjects] = useState([{ question: '', answer: '' }]);

  useEffect(() => {
    if (answer) {
      const updatedQnAObjects = qnAObjects.map((value, index) => {
        if (index === qnAObjects.length - 1) {
          value.answer = answer;
        }
        return value;
      });
      setQnAObjects(updatedQnAObjects);
      setAnswer('');
    }
  }, [answer, qnAObjects]);

  const onChat = async () => {
    if (asking) return;
    setAsking(true);
    if (qnAObjects.length === 1 && qnAObjects[0]?.question === '') {
      setQnAObjects([{ question: question, answer: '' }]);
    } else {
      setQnAObjects([...qnAObjects, { question: question, answer: '' }]);
    }
    try {
      const baseUrl = '/api/vertex';
      const requestBody = {
        question: question,
      };
      const result = await axios.post(baseUrl, JSON.stringify(requestBody), {
        //   headers: { 'Api-Key': process.env.NEXT_PUBLIC_API_ROUTE_KEY },
      });
      setAnswer(result.data);
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setQuestion('');
      setAsking(false);
    }
  };

  return (
    <>
      <div className={styles.chatArea}>
        {qnAObjects.map((value, index) => (
          <div className='mx-1' key={index}>
            {value.question && (
              <div className={styles.box}>{value.question}</div>
            )}
            {value.answer && (
              <div className={styles.answer}>{value.answer}</div>
            )}
          </div>
        ))}
      </div>

      <div className='w-full'>
        <div className='relative mt-4 rounded-md shadow-sm'>
          <input
            type='text'
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onChat();
              }
            }}
            placeholder='发送信息'
            className='block w-full rounded-md border-0 py-2 pl-3 pr-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-300 focus:outline-none sm:text-lg sm:leading-6'
          />
          <div className='absolute inset-y-0 right-3 flex items-center'>
            <button
              onClick={onChat}
              className='text-black disabled:text-neutral-500 mr-2'
              disabled={!Boolean(question) || asking}
            >
              {asking ? (
                <LoadingSpin />
              ) : (
                <FontAwesomeIcon
                  icon={chevronRightIconDefinition}
                  size='xl'
                  className='mr-3'
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
