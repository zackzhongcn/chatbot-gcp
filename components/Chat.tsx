import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '@/components/Chat.module.css';
import axios from 'axios';

type QnAObject = {
  question: string;
  answer: string;
};

function Chat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
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
    }
  };

  return (
    <>
      <div className={styles.chatArea}>
        {qnAObjects.map((value, index) => (
          <div key={index}>
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
        <div className={styles.input}>
          <textarea
            className={styles.submitArea}
            name='input'
            id='input'
            rows={3}
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onChat();
              }
            }}
          ></textarea>
          <button className={styles.submitBtn} onClick={onChat}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
