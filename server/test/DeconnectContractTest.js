const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deconnect Contract", function () {
  let Deconnect;
  let deconnect;
  let owner;

  const NUM_TOTAL_NOT_MY_POSTS = 5;
  const NUM_TOTAL_MY_POSTS = 3;

  let totalPosts;
  let totalMyPosts;

  beforeEach(async function () {
    Deconnect = await ethers.getContractFactory("DeconnectContract");
    [owner, addr1, addr2] = await ethers.getSigners();
    deconnect = await Deconnect.deploy();

    totalPosts = [];
    totalMyPosts = [];

    for (let i = 0; i < NUM_TOTAL_NOT_MY_POSTS; i++) {
      let post = {
        postContent: "Random text with id: " + i,
        username: addr1,
        isDeleted: false,
      };

      await deconnect.connect(addr1).addPost(post.postContent, post.isDeleted);
      totalPosts.push(post);
    }

    for (let i = 0; i < NUM_TOTAL_MY_POSTS; i++) {
      let post = {
        username: owner,
        postContent: "Random text with id: " + (NUM_TOTAL_NOT_MY_POSTS + i),
        isDeleted: false,
      };

      await deconnect.addPost(post.postContent, post.isDeleted);
      totalPosts.push(post);
      totalMyPosts.push(post);
    }
  });
  describe("Add Post", function () {
    it("should emit AddPost event", async function () {
      let post = {
        postContent: "New post",
        isDeleted: false,
      };
      await expect(await deconnect.addPost(post.postContent, post.isDeleted))
        .to.emit(deconnect, "AddPost")
        .withArgs(owner.address, NUM_TOTAL_NOT_MY_POSTS + NUM_TOTAL_MY_POSTS);
    });
  });
  describe("Get Posts", function () {
    it("should return the correct number of all posts", async function () {
      const postsFromChain = await deconnect.getAllPosts();
      expect(postsFromChain.length).to.equal(
        NUM_TOTAL_NOT_MY_POSTS + NUM_TOTAL_MY_POSTS
      );
    });
    it("should return the correct number of all my posts", async function () {
      const myPostsFromChain = await deconnect.getMyPosts();
      expect(myPostsFromChain.length).to.equal(NUM_TOTAL_MY_POSTS);
    });
  });

  describe("Delete Post", function () {
    it("should emit delete Post event", async function () {
      const POST_ID = 0;
      const POST_DELETED = true;

      await expect(deconnect.connect(addr1).deletePost(POST_ID, POST_DELETED))
        .to.emit(deconnect, "DeletePost")
        .withArgs(POST_ID, POST_DELETED);
    });
  });
});
