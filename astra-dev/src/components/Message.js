import ReactMarkdown from "react-markdown";
import Image from "next/image";

const Message = ({ role, content }) => {
  return (
    <div className="my-4 mx-auto flex w-full max-w-4xl ">
      <Image
        src={
          role === "user"
            ? "/profile_placeholder.png"
            : role === "assistant"
            ? "/Astra.jpeg"
            : "/Astra.jpeg"
        }
        height={40}
        width={40}
        alt="Avatar"
        className="self-start rounded-full border"
        unoptimized
      />
      <div className="flex-1 overflow-x-hidden pl-2">
        <div>
          <span className="text-base font-medium">
            {role === "user" ? "You " : role === "system" ? "System" : "Astra "}
          </span>
        </div>

        <div className="text-lg prose text-white">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
