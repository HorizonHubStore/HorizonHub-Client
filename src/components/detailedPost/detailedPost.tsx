import { useParams } from "react-router-dom";

const PostDetails: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
  
    // Fetch the detailed post data and comments based on postId
    // ...
  
    return (
      <div>
        {postId}
      </div>
    );
  };
  export default PostDetails;
