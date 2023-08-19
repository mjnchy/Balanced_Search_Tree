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

  function getLeaf (tree, branch) {
    if (!tree[branch]) return tree;
    tree = tree[branch];
    return getLeaf(tree, branch);
  };

  function traverse (tree, order, arr = [], callback) {
    switch (order) {
      case "preorder":
        if (!tree) return arr;

        arr.push(tree);
        traverse(tree.left, "preorder", arr);
        traverse(tree.right, "preorder", arr);
        break;

      case "inorder":
        if (!tree) return arr;

        traverse(tree.left, "inorder", arr);
        arr.push(tree);
        traverse(tree.right, "inorder", arr);
        break;

      case "postorder":
        if (!tree) return arr;

        traverse(tree.left, "postorder", arr);
        traverse(tree.right, "postorder", arr);
        arr.push(tree);
        break;
    };

    return callback? arr.forEach(node => callback(node)): arr;
  };

  function getDepth (node, wanted = "leaf", scope, depth = 0) {
    if (!node) return -1;
    if (!node.left && !node.right) return depth;

    if (wanted === "leaf") {
      let leftDepth = getDepth(node.left, "leaf", scope, depth + 1);
      let rightDepth = getDepth(node.right, "leaf", scope, depth + 1);

      return Math.max(leftDepth, rightDepth);
    }

    else {
      let wantedValue = typeof wanted === "object"? wanted.root: wanted;
      
      if (node === scope.find(wantedValue)) return depth;

      if (wantedValue < node.root) return getDepth(node.left, wantedValue, scope, depth + 1)
      else return getDepth(node.right, wantedValue, scope, depth + 1);

      // set node to root node 
      // run find on wanted which returns a node and set wanted to its result 
      // increment depth by one for each level until wanted is found;
      // return depth;
    };
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
            let wanted = getLeaf(tree.right, "left").root;
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

    inorder (callback) {
      return traverse(this.tree(), "inorder", [], callback);
    },

    preorder (callback) {
      return traverse(this.tree(), "preorder", [], callback);
    },

    postorder (callback) {
      return traverse(this.tree(), "postorder", [], callback);
    },

    height (node = this.tree()) {
      return getDepth(node, "leaf", this);
    },

    depth (node) {
      return getDepth(this.tree(), node, this);
    },

    isBalanced () {
      let tree = this.tree();
      
      if (!tree) return true;

      let leftHeight = this.height(tree.left);
      let rightHeight = this.height(tree.right);

      return Math.abs(leftHeight - rightHeight) <= 1? true: false;
    },

    rebalance () {
      return tree = buildTree(quicksort(workingArr));
    }
  };
};

// sort given array;
// make the binary tree with a null root, a null left subtree and a null right subtree;
// take the midpint of the now sorted array and set it as the root element of the top level node;
// now that the array is sorted and the midpoint of the array is the top level root element, we are left with a defined root, a null left and a null right subtree in the node itself;
// We come up with two new arrays, one for all items to the left of the midpoint in the original array and one for all items to the right of the midpoint of the original array;
// We should now be able to recursively call the function to sort all the remaining items;
