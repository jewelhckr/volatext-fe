import React, { useState, useRef } from "react";
import copy from "copy-to-clipboard";
import axios from "axios";
import { MdInfoOutline } from "react-icons/md";
// import { RefObject } from "react";

const Create = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [length, setLength] = useState<number>(15);
  const [password, setPassword] = useState<string>("");
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const [selfDestruct, setSelfDestruct] = useState<boolean>(false);
  const [viewsCount, setViewsCount] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [data, setData] = useState<{ Text: { sharing_code: string } }>({
    Text: { sharing_code: "" },
  });
  const [btnTxt, setBtnTxt] = useState<string>("Copy");
  const modalRef = useRef<HTMLLabelElement>(null); 

  const addToken = (token: string, code: string) => {
    const prevTokens = JSON.parse(localStorage.getItem("tokens") || "[]");
    localStorage.setItem("tokens", JSON.stringify([...prevTokens, { token, code }]));
  };

  const createText = () => {
    setLoading(true);
    const requestData = {
      text,
      length,
      password,
      isProtected,
      selfDestruct,
      viewsCount,
    };
    axios
      .post(`${process.env.baseUrl}/create`, requestData)
      .then((response) => {
        const responseData = response.data;
        if (responseData.message === "Success") {
          if (viewsCount) {
            addToken(responseData.Text.accessToken, responseData.Text.sharing_code);
          }
          setData(responseData);
          setText("");
          if (modalRef.current) {
            modalRef.current.click();
          }
        }
      })
      .catch((error) => {
        console.error("Error creating text:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center gap-10 lg:px-32 mt-10 flex-col lg:flex-row pb-10">
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <span>Cannot enable view counts while self-destruct is active.</span>
          </div>
        </div>
      )}

      <div className="lg:w-[60%]">
        <textarea
          className="p-2 bg-transparent border-2 border-gray-900 w-full h-96 rounded-md"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          className="btn my-4 lg:w-fit flex items-center lg:px-20 w-full disabled:cursor-not-allowed"
          onClick={createText}
          disabled={!text || length < 1 || (isProtected && !password) || loading}
        >
          {loading ? "Creating..." : "Create"} {loading && <p className="animate-bounce text-3xl">*</p>}
        </button>
      </div>

      <div className="lg:w-[30%] w-full">
        <h1 className="font-semibold text-xl mb-5">Options</h1>

        <div className="flex items-center gap-1 my-3">
          <p>Expire in</p>
          <input
            type="number"
            value={length}
            className="text-center w-10 rounded-md"
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
          <p>minutes</p>
        </div>

        <div className="w-full mt-5">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Password-protected</h2>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={isProtected}
              onChange={() => setIsProtected(!isProtected)}
            />
          </div>
          {isProtected && (
            <input
              type="password"
              placeholder="Enter a password..."
              className="rounded-md my-3 w-full py-2 border-none outline-none pl-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>

        <div className="w-full mt-5">
          <div className="flex items-center gap-2">
            <div className="tooltip" title="Text gets automatically deleted after being viewed once.">
              <MdInfoOutline />
            </div>
            <h2 className="font-semibold">Self-destruct</h2>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={selfDestruct}
              onChange={() => {
                setSelfDestruct(!selfDestruct);
                if (viewsCount) {
                  setViewsCount(false);
                  setShowToast(false);
                }
              }}
            />
          </div>
        </div>

        <div className="w-full mt-5">
          <div className="flex items-center gap-2">
            <div className="tooltip" title="Enable to see the number of views on your link.">
              <MdInfoOutline />
            </div>
            <h2 className="font-semibold">Views count</h2>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={viewsCount}
              onChange={() => {
                if (!selfDestruct) {
                  setViewsCount(!viewsCount);
                  if (viewsCount) {
                    setShowToast(false);
                  }
                } else {
                  setShowToast(true);
                  setTimeout(() => {
                    setShowToast(false);
                  }, 2500);
                }
              }}
            />
          </div>
        </div>
      </div>

      <label htmlFor="my-modal-6" className="btn hidden" ref={modalRef}>
        Open modal
      </label>

      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Text link created successfully</h3>
          <div className="my-5">
            <div className="w-full gap-1 flex items-center justify-center">
              <input
                type="text"
                className="input input-bordered w-[70%]"
                value={`${process.env.baseUrl}/${data.Text.sharing_code}`}
              />
              <button
                className="btn btn-square"
                onClick={() => {
                  copy(`${process.env.baseUrl}/${data.Text.sharing_code}`);
                  setBtnTxt("✔️");
                  setTimeout(() => {
                    setBtnTxt("Copy");
                  }, 1000);
                }}
              >
                {btnTxt}
              </button>
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
