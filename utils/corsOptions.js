// const allowedOrigins = require('./allowedOrigins')

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200
// }

// module.exports = corsOptions


// import React, { useEffect, useState } from "react";
// import { IconButton, Typography } from "@mui/material";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import ThumbDownIcon from "@mui/icons-material/ThumbDown";
// import blogService from "../http/blogService";
// import axios from "axios";

// const LikeDislikes = ({ blogId }) => {
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await blogService.getLikes(blogId);
//         setLikes(response.data.likes.length);

//         const responseDislikes = await blogService.getDislikes(blogId);
//         setDislikes(responseDislikes.data.dislikes.length);
//       } catch (error) {
//         console.log(error.message);
//       }
//     };

//     fetchData();
//   }, [blogId]);

//   const handleLike = async () => {
//     try {
//       await blogService.likeBlog(blogId);
//       setLikes(likes + 1);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const handleDislike = async () => {
//     try {
//       await blogService.dislikeBlog(blogId);
//       setDislikes(dislikes + 1);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <div>
//       <IconButton onClick={handleLike}>
//         <ThumbUpIcon />
//       </IconButton>
//       <Typography>{likes}</Typography>
//       <IconButton onClick={handleDislike}>
//         <ThumbDownIcon />
//       </IconButton>
//       <Typography>{dislikes}</Typography>
//     </div>
//   );
// };

// export default LikeDislikes;
