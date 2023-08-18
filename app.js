function quicksort (arr) {
  if (!Array.isArray(arr)) return "invalid array";

  if (arr.length <= 1) return arr;

  let midpoint = Math.floor(arr.length / 2);
  let pivot = arr[midpoint];

  let left = [];
  let right = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    if (arr[i] > pivot) right.push(arr[i]);
  };

  return [...quicksort(left), pivot, ...quicksort(right)];
};

function Node (value) {
  return {
    root: value,
    left: null,
    right: null,
  };
};

function buildTree (arr) {
  if (arr.length <= 0) return null;
  if (arr.length === 1) return Node(arr[0]);

  let midpoint = Math.floor(arr.length / 2); 
  let root = arr[midpoint];
  let node = Node(root);

  let left  = arr.slice(0, midpoint);
  let right = arr.slice(midpoint + 1);
  
  node.left = buildTree(left);
  node.right = buildTree(right);

  return node;
};

function makeBST (arr) {
  if (!arr || !Array.isArray(arr)) return "parameter required, must be an array";

  let sortedArr = quicksort(arr);
  let tree =  buildTree(sortedArr);
  let workingArr = arr;

  function bfs (tree) {
    let queue = [tree];
    let arr = [];

    while (queue.length) {
      let currentTree = queue.shift();

      arr.push(currentTree);
      currentTree.left? queue.push(currentTree.left): null;
      currentTree.right? queue.push(currentTree.right): null;
    };

    return arr;
  };

  function dfs (tree, branch) {
    if (!tree[branch]) return tree;

    tree = tree[branch];

    return dfs(tree, branch);
  };

  return {
    tree: () => tree,

    insert (value, tree = this.tree(), currentTree = null, branch) {
      if (currentTree && currentTree.root === value) return "duplicates not allowed";
      if (tree === null) {
        workingArr.push(value);
        return currentTree[branch] = Node(value);
      };

      let nextBranch = value < tree.root? "left": "right";

      return this.insert(value, tree[nextBranch], tree, nextBranch);
    },

    find (value, tree = this.tree(), prevTree = null, branch, cb = null) {
      if (!value) return "parameter required";
      if (!tree) return `${value} does not exist in the tree`;

      if (value === tree.root) return cb? cb(value, tree, prevTree, branch): tree;

      let nextBranch = value < tree.root? "left": "right";

      return this.find(value, tree[nextBranch], tree, nextBranch, cb);
    },

    delete (value) {
      let self = this;
      
      function cases (value, tree, prevTree = null, branch) {
        if (!tree.left && !tree.right) prevTree[branch] = null

        else {
          let singleChild = !tree.left || !tree.right? true: false;

          if (singleChild === true) {
            let childNode = tree.left? tree.left: tree.right;
            prevTree[branch] = childNode;
            childNode = null;
          }

          else {
            let wanted = dfs(tree.right, "left").root;
            self.delete(wanted);
            prevTree[branch].root = wanted;
          };
        };

        return `${value} has been successfully removed from the tree`;
      };

      return this.find(value, this.tree(), null, null, cases);
    },

    levelOrder (callback) {
      let arr = bfs(this.tree());
      return callback? arr.forEach(node => callback(node)): arr;
    },

  };
};



let testTree = makeBST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

// sort given array;
// make the binary tree with a null root, a null left subtree and a null right subtree;
// take the midpint of the now sorted array and set it as the root element of the top level node;
// now that the array is sorted and the midpoint of the array is the top level root element, we are left with a defined root, a null left and a null right subtree in the node itself;
// We come up with two new arrays, one for all items to the left of the midpoint in the original array and one for all items to the right of the midpoint of the original array;
// We should now be able to recursively call the function to sort all the remaining items;

