import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useUser } from "../Providers/AuthContext";

export default function Room() {
  const { roomId } = useParams();
  const { user } = useUser();
  const myMeeting = async (element) => {
    const appId = Number(import.meta.env.VITE_ZegoUIKit_APP_ID);
    const serverSecret = import.meta.env.VITE_ZegoUIKit_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      user._id,
      user.name
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${import.meta.env.VITE_ZegoUIKit_SHARED_URL}/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
    });
  };
  return (
    <div className="w-full  bg-amber-300">
      {" "}
      <div className="h-screen" ref={myMeeting} />{" "}
    </div>
  );
}
