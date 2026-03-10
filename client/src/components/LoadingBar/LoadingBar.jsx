export default function LoadingBar({ value }) {
  return (
    <div className="w-full bg-gray-500 rounded-full h-2 mb-6">
      <div
        className="h-2 bg-green-400 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>
      <p className="text-center w-full text-sm text-gray-400 mt-2">
        {value}%
      </p>
    </div>
  );
}
