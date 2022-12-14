pragma solidity ^0.8.9;

contract DeconnectContract {
    event AddPost(address recipient, uint postId);
    event DeletePost(uint postId, bool isDeleted);
    
    struct Post {
        unit id;
        address username;
        string postContent;
        unit likes;
        bool isDeleted;
    }

    Post[] private posts;

    mapping(uint => address) postToOwner;

    function addPost(string memory postContent, bool isDeleted) external {
        unit postId = posts.length;
        posts.push(Post(postId, msg.sender, postContent, isDeleted));
        postToOwner[postId] = msg.sender;
        emit AddPost(msg.sender, postId);
    }
    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory temporary = new Post[](posts.length);

        uint counter = 0;
        for (uint i = 0; i < posts.length; i++) {
            if (!posts[i].isDeleted) {
                temporary[counter] = posts[i];
                counter++;
            }
        }

        Post[] memory result= new Post[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }
    function getMyPosts() external view returns (Post[] memory) {
        Post[] memory temporary = new Post[](posts.length);

        uint counter = 0;
        for (uint i = 0; i < posts.length; i++) {
            if (postToOwner[i] == msg.sender && posts[i].isDeleted == false) {
                temporary[counter] = posts[i];
                counter++;
            }
        }

        Post[] memory result= new Post[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }
    function deletePost(uint postId, bool isDeleted) external {
        if(postToOwner[postId] == msg.sender) {
            posts[postId].isDeleted = isDeleted;
            emit DeletePost(postId, isDeleted);
        }
    }
}