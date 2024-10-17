"use client";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <button onClick={() => window.location.href = '/chat'} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">チャット</button>
    </div>
  );
}

export default Index;
