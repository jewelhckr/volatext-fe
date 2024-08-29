import copy from "copy-to-clipboard";

export const DynamicButton = ({ text }: { text: string; }) => {

  const handleCopyText = () => {
    copy(text);
  };

  return (
    <button
      className="btn my-4 lg:w-fit lg:px-20 w-full disabled:cursor-not-allowed"
      onClick={handleCopyText}
    >
      Copy text
    </button>
  );
};

export default DynamicButton;
