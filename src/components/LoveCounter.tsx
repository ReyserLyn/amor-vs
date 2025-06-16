interface LoveCounterProps {
  name: string;
  count: number;
  isCurrentUser: boolean;
  isSubmitting: boolean;
  onHeartClick: () => void;
}

export function LoveCounter({ name, count, isCurrentUser, isSubmitting, onHeartClick }: LoveCounterProps) {
  const handleClick = () => {
    if (isCurrentUser && !isSubmitting) {
      onHeartClick();
    }
  };

  return (
    <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{name}</h2>
      
      <button
        onClick={handleClick}
        disabled={!isCurrentUser || isSubmitting}
        className={`text-8xl mb-6 transition-all duration-200 ${
          isCurrentUser 
            ? 'hover:scale-105 cursor-pointer filter drop-shadow-lg active:scale-95 hover:brightness-110' 
            : 'opacity-60 cursor-not-allowed'
        } ${isSubmitting ? 'animate-pulse' : ''}`}
      >
        ❤️
      </button>
      
      <p className="text-6xl font-bold text-gray-800 mb-4">{count}</p>
      
      {isCurrentUser && (
        <div className="text-center text-sm text-gray-600">
          {isSubmitting ? '💕 Enviando amor...' : '👆 Toca para enviar amor'}
        </div>
      )}
    </div>
  );
} 