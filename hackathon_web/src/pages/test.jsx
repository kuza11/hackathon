import { useState, useEffect } from 'react';

function YourComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1); // Use functional update to ensure correct previous state
    }, 1000);

    // Clear interval when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
}

export default YourComponent;