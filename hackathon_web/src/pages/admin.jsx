import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import  useSWR  from 'swr'
let tmr;

async function getData(){

	const res = await fetch('/api/live');

	const data = await res.json();


	return data;

}

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-2xl">
      <h1 className="mb-8">Logs from devices</h1>
      <Logs />
    </main>
  );
}

function Logs() {
  const [logs, setLogs] = useState([
    { time: 12, sens_top: 89, sens_bottom: 90, angle: 90 },
  ]);
  const [text, setText] = useState(logs.map((e) => objToLog(e)))
  const router = useRouter();


  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval( async() => {
      
      let resp = await getData();
      //console.log(resp);
      setData(resp);
      //console.log(data);
    }, 2000); // fetch every 5000 milliseconds (5 seconds)

    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  
  /*const fetcher = (...args) => fetch(...args).then((res) => res.json());
  let result = useSWR('/api/todos', fetcher, { refreshInterval: 1000 });*/

  /*useEffect(() => {
    setLogs(result);
   // setText(logs.map((e) => objToLog(e)))
  }, [setLogs]);*/

  

  function objToLog(obj) {
    return `[${new Date(obj.time * 1000).toDateString()}]: top sensor: ${obj.sens_top
      }, bottom sensor: ${obj.sens_bottom}, at angle: ${obj.angle};\n`;
  }

  return (
    
     <p> {JSON.stringify(data)}</p>
   
  );
}

