import React, { useState } from 'react';

function AppTest() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('준비됨');

  const testButton = () => {
    setCount(count + 1);
    setMessage('버튼이 작동합니다! 클릭 ' + (count + 1) + '회');
    console.log('버튼 클릭됨:', count + 1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      padding: '40px',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>
        분자 오비탈 예측기 - 테스트
      </h1>

      <div style={{
        backgroundColor: '#2a2a3e',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '600px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>버튼 테스트</h2>

        <button
          onClick={testButton}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
        
          테스트 버튼 클릭
        </button>

        <div style={{
          backgroundColor: '#1a1a2e',
          padding: '20px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
            {message}
          </p>
          <p style={{ fontSize: '16px', color: '#aaa' }}>
            클릭 횟수: {count}
          </p>
        </div>

        <div style={{
          borderTop: '1px solid #444',
          paddingTop: '20px'
        }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            F12를 눌러서 개발자 도구를 열고 Console 탭을 확인하세요!
          </p>
          <p style={{ fontSize: '14px', color: '#888' }}>
            버튼을 클릭하면 콘솔에 로그가 출력됩니다.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        backgroundColor: '#2a2a3e',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '600px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>다음 단계</h2>
        <ol style={{ lineHeight: '2' }}>
          <li>위의 테스트 버튼이 잘 작동하나요?</li>
          <li>숫자가 증가하나요?</li>
          <li>F12 → Console에 로그가 보이나요?</li>
        </ol>
        <p style={{ marginTop: '20px', color: '#ffaa00' }}>
          ✅ 모두 작동하면 → 분자 오비탈 기능을 추가합니다<br/>
          ❌ 작동 안 하면 → 스크린샷이나 에러 메시지를 알려주세요
        </p>
      </div>
    </div>
  );
}

export default AppTest;
