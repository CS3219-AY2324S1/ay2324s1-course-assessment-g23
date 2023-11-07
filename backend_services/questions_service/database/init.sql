DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'user') THEN
        CREATE USER "user" WITH PASSWORD 'password';
    END IF;
END $$;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS questions(
    question_id VARCHAR(255) PRIMARY KEY,
    title TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    complexity VARCHAR(255) NOT NULL
);
INSERT INTO questions (question_id, title, description, category, complexity)
VALUES
(uuid_generate_v4()::VARCHAR, 'Reverse a String', 'Write a function that reverses a string. The input string is given as an array 
of characters s. 
    
You must do this by modifying the input array in-place with O(1) extra memory. 
    
Example 1: 

Input: s = ["h","e","l","l","o"] 
Output: ["o","l","l","e","h"] 
Example 2: 

Input: s = ["H","a","n","n","a","h"] 
Output: ["h","a","n","n","a","H"] 

Constraints: 

• 1 <= s.length <= 10^5
• s[i] is a printable ascii character. ', 'Strings, Algorithms', 'Easy'),


(uuid_generate_v4()::VARCHAR, 'Linked List Cycle Detection', 
'Given head, the head of a linked list, determine if the linked list has a cycle 
in it. 
There is a cycle in a linked list if there is some node in the list that can be 
reached again by continuously following the next pointer. Internally, pos is 
used to denote the index of the node that tail''s next pointer is connected to. 
Note that pos is not passed as a parameter. 
Return true if there is a cycle in the linked list. Otherwise, return false. 

Example 1: 
(3) -> (2) -> (0) -> (-4)
        ↑             ↓
        <--------------
Input: head = [3,2,0,-4], pos = 1 
Output: true 
Explanation: There is a cycle in the linked list, where the tail connects to the 
1st node (0-indexed). 

Example 2: 
(1) -> (2)
 ↑      ↓
 <-------
Input: head = [1,2], pos = 0 
Output: true 
Explanation: There is a cycle in the linked list, where the tail connects to the 
0th node. 

Example 3: 
(1)
Input: head = [1], pos = -1 
Output: false 
Explanation: There is no cycle in the linked list. 

Constraints: 
• The number of the nodes in the list is in the range [0, 104]. 
• -10^5 <= Node.val <= 10^5
• pos is -1 or a valid index in the linked-list. 

Follow up: Can you solve it using O(1) (i.e. constant) memory?', 
'Data Structures, Algorithms', 'Easy'),


(uuid_generate_v4()::VARCHAR, 'Roman to Integer',
'### Roman Numerals
 Roman numerals are represented by seven different symbols: I, V, X, L, C, D, and M.

 ### Symbols and Values
 | Symbol | Value |
 | ------ | ----- |
 | I      | 1     |
 | V      | 5     |
 | X      | 10    |
 | L      | 50    |
 | C      | 100   |
 | D      | 500   |
 | M      | 1000  |

 ### Examples
 - For example, 2 is written as `II` in Roman numeral, just two ones added together.
 - 12 is written as `XII`, which is simply `X + II`.
 - The number 27 is written as `XXVII`, which is `XX + V + II`.

 Roman numerals are usually written largest to smallest from left to right. However, 
 there are exceptions such as the numeral for four, which is not `IIII`. Instead, 
 the number four is written as `IV`. This is because the one is before the five, and 
 so we subtract it, making four. This same principle applies to the number nine, 
 which is written as `IX`.

 ### Subtraction Instances
 There are six instances where subtraction is used:
 - `I` can be placed before `V` (5) and `X` (10) to make 4 and 9.
 - `X` can be placed before `L` (50) and `C` (100) to make 40 and 90.
 - `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.

 ### Conversion Examples

 ### Example 1:
 - Input: `s = "III"`
 - Output: `3`
 - Explanation: `III` = 3.

 ### Example 2:
 - Input: `s = "LVIII"`
 - Output: `58`
 - Explanation: `L = 50`, `V= 5`, `III = 3`.

 ### Example 3:
 - Input: `s = "MCMXCIV"`
 - Output: `1994`
 - Explanation: `M = 1000`, `CM = 900`, `XC = 90` and `IV = 4`.

 ### Constraints
 - `1 <= s.length <= 15`
 - `s` contains only the characters ("I", "V", "X", "L", "C", "D", "M").
 - It is guaranteed that `s` is a valid roman numeral in the range `[1, 3999]`.

', 'Algorithms', 'Easy'),


(uuid_generate_v4()::VARCHAR, 'Add Binary', 
'Given two binary strings a and b, return their sum as a binary string.

Example 1: 
Input: a = "11", b = "1" 
Output: "100" 
Example 2: 
Input: a = "1010", b = "1011" 
Output: "10101" 
 
Constraints: 
• 1 <= a.length, b.length <= 104 
• a and b consist only of ''0'' or ''1'' characters. 
• Each string does not contain leading zeros except for the zero itself.
','Bit Manipulation, Algorithms', 'Easy'),


(uuid_generate_v4()::VARCHAR, 'Fibonacci Number', 
'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the 
Fibonacci sequence, such that each number is the sum of the two preceding 
ones, starting from 0 and 1. That is, 
F(0) = 0, F(1) = 1 
F(n) = F(n - 1) + F(n - 2), for n > 1. 
Given n, calculate F(n). 
 
Example 1: 
Input: n = 2 
Output: 1 
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1. 
Example 2: 
Input: n = 3 
Output: 2 
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2. 
Example 3: 
Input: n = 4 
Output: 3 
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3. 
 
Constraints: 
• 0 <= n <= 30 
', 'Recursion, Algorithms', 'Easy'),


(uuid_generate_v4()::VARCHAR, 'Implement Stack using Queues', 
'Implement a last-in-first-out (LIFO) stack using only two queues. The 
implemented stack should support all the functions of a normal stack (push, 
top, pop, and empty). 

Implement the MyStack class: 
void push(int x) Pushes element x to the top of the stack. 
int pop() Removes the element on the top of the stack and returns it. 
int top() Returns the element on the top of the stack. 
boolean empty() Returns true if the stack is empty, false otherwise. 
Notes: 
You must use only standard operations of a queue, which means that only 
push to back, peek/pop from front, size and is empty operations are valid. 
Depending on your language, the queue may not be supported natively. You 
may simulate a queue using a list or deque (double-ended queue) as long as 
you use only a queue''s standard operations. 
 
Example 1: 
Input 
["MyStack", "push", "push", "top", "pop", "empty"]
[[], [1], [2], [], [], []] 
Output 
[null, null, null, 2, 2, false] 
Explanation:
MyStack myStack = new MyStack(); 
myStack.push(1); 
myStack.push(2); 
myStack.top(); // return 2 
myStack.pop(); // return 2 
myStack.empty(); // return False 
 
Constraints: 
• 1 <= x <= 9 
• At most 100 calls will be made to push, pop, top, and empty. 
• All the calls to pop and top are valid. 
 
Follow-up: Can you implement the stack using only one queue?
', 'Data Structures', 'Easy'),


(uuid_generate_v4()::VARCHAR, 'Combine Two Tables', 
'SQL Schema 
Table: Person 
+-------------+---------+ 
| Column Name | Type    | 
+-------------+---------+ 
| personId    | int     | 
| lastName    | varchar | 
| firstName   | varchar | 
+-------------+---------+ 
personId is the primary key (column with unique values) for this table. 
This table contains information about the ID of some persons and their first 
and last names. 
 
Table: Address 
+-------------+---------+ 
| Column Name | Type    | 
+-------------+---------+ 
| addressId   | int     | 
| personId    | int     | 
| city        | varchar | 
| state       | varchar | 
+-------------+---------+ 
addressId is the primary key (column with unique values) for this table. 
Each row of this table contains information about the city and state of one 
person with ID = PersonId. 

Write a solution to report the first name, last name, city, and state of each 
person in the Person table. If the address of a personId is not present in the 
Address table, report null instead. 
Return the result table in any order. 
The result format is in the following example. 
 
Example 1: 
Input: 
Person table: 
+----------+----------+-----------+ 
| personId | lastName | firstName | 
+----------+----------+-----------+ 
| 1        | Wang     | Allen     | 
| 2        | Alice    | Bob       | 
+----------+----------+-----------+ 
Address table: 
+-----------+----------+---------------+------------+ 
| addressId | personId | city          | state      | 
+-----------+----------+---------------+------------+ 
| 1         | 2        | New York City | New York   | 
| 2         | 3        | Leetcode      | California | 
+-----------+----------+---------------+------------+ 
Output: 
+-----------+----------+---------------+----------+ 
| firstName | lastName | city          | state    | 
+-----------+----------+---------------+----------+ 
| Allen     | Wang     | Null          | Null     | 
| Bob       | Alice    | New York City | New York | 
+-----------+----------+---------------+----------+ 
Explanation: 
There is no address in the address table for the personId = 1 so we return 
null in their city and state. 
addressId = 1 contains information about the address of personId = 2.
', 'Databases', 'Easy'),


(uuid_generate_v4()::VARCHAR, 'Repeated DNA Sequences', 
'The DNA sequence is composed of a series of nucleotides abbreviated as ''A'', 
''C'', ''G'', and ''T''. 
For example, "ACGAATTCCG" is a DNA sequence. 
When studying DNA, it is useful to identify repeated sequences within the 
DNA. 
Given a string s that represents a DNA sequence, return all the 10-letter-long 
sequences (substrings) that occur more than once in a DNA molecule. 
You may return the answer in any order.

Example 1:
Input: s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT" 
Output: ["AAAAACCCCC","CCCCCAAAAA"] 
Example 2: 
Input: s = "AAAAAAAAAAAAA" 
Output: ["AAAAAAAAAA"] 
 
Constraints: 
• 1 <= s.length <= 10^5
• s[i] is either ''A'', ''C'', ''G'', or ''T''. 
', 'Algorithms, Bit Manipulation', 'Medium'),


(uuid_generate_v4()::VARCHAR, 'Course Schedule', 
'There are a total of numCourses courses you have to take, labeled from 0 to 
numCourses - 1. You are given an array prerequisites where prerequisites[i] 
= [ai, bi] indicates that you must take course bi first if you want to take 
course ai. 
For example, the pair [0, 1], indicates that to take course 0 you have to first 
take course 1. 
Return true if you can finish all courses. Otherwise, return false. 
 
Example 1: 
Input: numCourses = 2, prerequisites = [[1,0]] 
Output: true 
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0. So it is possible. 
Example 2: 
Input: numCourses = 2, prerequisites = [[1,0],[0,1]] 
Output: false 
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0, and to take course 0 
you should also have finished course 1. So it is impossible. 
 
Constraints: 
• 1 <= numCourses <= 2000 
• 0 <= prerequisites.length <= 5000 
• prerequisites[i].length == 2 
• 0 <= ai, bi < numCourses 
• All the pairs prerequisites[i] are unique.
', 'Data Structures, Algorithms', 'Medium'),


(uuid_generate_v4()::VARCHAR, 'LRU Cache Design', 
'Design a data structure that follows the constraints of a Least Recently Used 
(LRU) cache. 
Implement the LRUCache class: 
LRUCache(int capacity) Initialize the LRU cache with positive size capacity. 
int get(int key) Return the value of the key if the key exists, otherwise return 
-1. 
void put(int key, int value) Update the value of the key if the key exists. 
Otherwise, add the key-value pair to the cache. If the number of keys 
exceeds the capacity from this operation, evict the least recently used key. 
The functions get and put must each run in O(1) average time complexity. 
 
Example 1: 
Input 
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"] 
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]] 
Output 
[null, null, null, 1, null, -1, null, -1, 3, 4] 
Explanation 
LRUCache lRUCache = new LRUCache(2); 
LRUCache.put(1, 1); // cache is {1=1} 
LRUCache.put(2, 2); // cache is {1=1, 2=2} 
LRUCache.get(1); // return 1 
LRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3} 
LRUCache.get(2); // returns -1 (not found) 
LRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3} 
LRUCache.get(1); // return -1 (not found) 
LRUCache.get(3); // return 3 
LRUCache.get(4); // return 4 
 
Constraints: 
• 1 <= capacity <= 3000 
• 0 <= key <= 10^4
• 0 <= value <= 10^5
• At most 2 * 10^5 calls will be made to get and put. 
', 'Data Structures', 'Medium'),


(uuid_generate_v4()::VARCHAR, 'Longest Common Subsequence', 
'Given two strings text1 and text2, return the length of their longest 
common subsequence. If there is no common subsequence, return 0. 
A subsequence of a string is a new string generated from the original string 
with some characters (can be none) deleted without changing the relative 
order of the remaining characters. 
For example, "ace" is a subsequence of "abcde". 
A common subsequence of two strings is a subsequence that is common to 
both strings. 

Example 1: 
Input: text1 = "abcde", text2 = "ace" 
Output: 3 
Explanation: The longest common subsequence is "ace" and its length is 3. 
Example 2: 
Input: text1 = "abc", text2 = "abc"
Output: 3 
Explanation: The longest common subsequence is "abc" and its length is 3. 
Example 3: 
Input: text1 = "abc", text2 = "def" 
Output: 0 
Explanation: There is no such common subsequence, so the result is 0. 
 
Constraints: 
• 1 <= text1.length, text2.length <= 1000 
• text1 and text2 consist of only lowercase English characters.
', 'Strings, Algorithms', 'Medium'),


(uuid_generate_v4()::VARCHAR, 'Rotate Image', 
'You are given an n x n 2D matrix representing an image, rotate the image by 
90 degrees (clockwise). 
You have to rotate the image in-place, which means you have to modify the 
input 2D matrix directly. DO NOT allocate another 2D matrix and do the 
rotation. 

Example 1: 
+---+---+---+     +---+---+---+
| 1 | 2 | 3 |     | 7 | 4 | 1 |
+---+---+---+     +---+---+---+
| 4 | 5 | 6 | ==> | 8 | 5 | 2 |
+---+---+---+     +---+---+---+
| 7 | 8 | 9 |     | 9 | 6 | 3 |
+---+---+---+     +---+---+---+
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]] 
Output: [[7,4,1],[8,5,2],[9,6,3]]

Example 2:
+---+---+---+---+     +---+---+---+---+
| 5 | 1 | 9 | 11|     | 15| 13| 2 | 5 |
+---+---+---+---+     +---+---+---+---+
| 2 | 4 | 8 | 10|     | 14| 3 | 4 | 1 |
+---+---+---+---+ ==> +---+---+---+---+
| 13| 3 | 6 | 7 |     | 12| 6 | 8 | 9 |
+---+---+---+---+     +---+---+---+---+
| 15| 14| 12| 16|     | 16| 7 | 10| 11|
+---+---+---+---+     +---+---+---+---+
Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] 
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]] 
Constraints: 
• n == matrix.length == matrix[i].length 
• 1 <= n <= 20 
• -1000 <= matrix[i][j] <= 1000
', 'Arrays, Algorithms', 'Medium'),


(uuid_generate_v4()::VARCHAR, 'Airplane Seat Assignment Probability',
'n passengers board an airplane with exactly n seats. The first passenger has 
lost the ticket and picks a seat randomly. But after that, the rest of the 
passengers will: 
Take their own seat if it is still available, and 
Pick other seats randomly when they find their seat occupied 
Return the probability that the nth person gets his own seat. 

Example 1: 
Input: n = 1 
Output: 1.00000 
Explanation: The first person can only get the first seat. 
Example 2: 
Input: n = 2 
Output: 0.50000 
Explanation: The second person has a probability of 0.5 to get the second 
seat (when first person gets the first seat). 
 
Constraints: 
• 1 <= n <= 10^5
', 'Brainteaser', 'Medium'),


(uuid_generate_v4()::VARCHAR, 'Validate Binary Search Tree',
'Given the root of a binary tree, determine if it is a valid binary search tree 
(BST). 
A valid BST is defined as follows: 
• The left subtree of a node contains only nodes with keys less than 
the node''s key. 
• The right subtree of a node contains only nodes with keys greater 
than the node''s key. 
• Both the left and right subtrees must also be binary search trees. 

Example 1: 
  (A)
  / \
(B) (C)
Input: root = [2,1,3] 
Output: true 

Example 2:
  (5)
  / \
(1) (4)
    / \
  (3) (6)
Input: root = [5,1,4,null,null,3,6] 
Output: false 
Explanation: The root node''s value is 5 but its right child''s value is 4.
Constraints: 
• The number of nodes in the tree is in the range [1, 10^4]. 
• -2^31 <= Node.val <= 2^31 - 1
', 'Data Structures, Algorithms', 'Medium'),


(uuid_generate_v4()::VARCHAR, 'Sliding Window Maximum',
'You are given an array of integers nums, there is a sliding window of size k 
which is moving from the very left of the array to the very right. You can 
only see the k numbers in the window. Each time the sliding window moves 
right by one position. 
Return the max sliding window. 
 
Example 1: 
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3 
Output: [3,3,5,5,6,7] 
Explanation: 
Window position              Max 
-------------------------    ----- 
[1  3  -1] -3  5  3  6  7    3 
 1 [3  -1  -3] 5  3  6  7    3 
 1  3 [-1  -3  5] 3  6  7    5 
 1  3  -1 [-3  5  3] 6  7    5 
 1  3  -1  -3 [5  3  6] 7    6 
 1  3  -1  -3  5 [3  6  7]   7 
Example 2: 
Input: nums = [1], k = 1 
Output: [1] 
 
Constraints: 
• 1 <= nums.length <= 10^5
• -10^4 <= nums[i] <= 10^4
• 1 <= k <= nums.length 
', 'Arrays, Algorithms', 'Hard'),


(uuid_generate_v4()::VARCHAR, 'N-Queen Problem',
'The n-queens puzzle is the problem of placing n queens on an n x n 
chessboard such that no two queens attack each other. 
 
Given an integer n, return all distinct solutions to the n-queens puzzle. You 
may return the answer in any order. 
 
Each solution contains a distinct board configuration of the n-queens'' 
placement, where ''Q'' and ''.'' both indicate a queen and an empty space, 
respectively.

Example 1:
+---+---+---+---+  +---+---+---+---+
|   | Q |   |   |  |   |   | Q |   |
+---+---+---+---+  +---+---+---+---+
|   |   |   | Q |  | Q |   |   |   |
+---+---+---+---+  +---+---+---+---+
| Q |   |   |   |  |   |   |   | Q |
+---+---+---+---+  +---+---+---+---+
|   |   | Q |   |  |   | Q |   |   |
+---+---+---+---+  +---+---+---+---+
Input: n = 4 
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]] 
Explanation: There exist two distinct solutions to the 4-queens puzzle as 
shown above 
Example 2: 
Input: n = 1 
Output: [["Q"]] 
Constraints: 
• 1 <= n <= 9 
', 'Algorithms', 'Hard'),


(uuid_generate_v4()::VARCHAR, 'Serialize and Deserialize a Binary Tree',
'Serialization is the process of converting a data structure or object into a 
sequence of bits so that it can be stored in a file or memory buffer, or 
transmitted across a network connection link to be reconstructed later in 
the same or another computer environment. 

Design an algorithm to serialize and deserialize a binary tree. There is no 
restriction on how your serialization/deserialization algorithm should work. 
You just need to ensure that a binary tree can be serialized to a string and 
this string can be deserialized to the original tree structure. 

Clarification: The input/output format is the same as how LeetCode 
serializes a binary tree. You do not necessarily need to follow this format, so 
please be creative and come up with different approaches yourself. 

Example 1: 
  (1)
  / \
(2) (3)
    / \
  (4) (5)
Input: root = [1,2,3,null,null,4,5] 
Output: [1,2,3,null,null,4,5] 
Example 2: 
Input: root = [] 
Output: []

Constraints: 
• The number of nodes in the tree is in the range [0, 10^   4]. 
• -1000 <= Node.val <= 1000
', 'Data Structures, Algorithms', 'Hard'),


(uuid_generate_v4()::VARCHAR, 'Wildcard Matching',
'Given an input string (s) and a pattern (p), implement wildcard pattern 
matching with support for ''?'' and ''*'' where: 
• ''?'' Matches any single character. 
• ''*'' Matches any sequence of characters (including the empty 
sequence). 
The matching should cover the entire input string (not partial). 

Example 1: 
Input: s = "aa", p = "a" 
Output: false 
Explanation: "a" does not match the entire string "aa". 
Example 2: 
Input: s = "aa", p = "*" 
Output: true 
Explanation: ''*'' matches any sequence. 
Example 3: 
Input: s = "cb", p = "?a" 
Output: false 
Explanation: ''?'' matches ''c'', but the second letter is ''a'', which does not 
match ''b''. 
 
Constraints: 
• 0 <= s.length, p.length <= 2000 
• s contains only lowercase English letters. 
• p contains only lowercase English letters, ''?'' or ''*''. 
', 'Strings, Algorithms', 'Hard'),


(uuid_generate_v4()::VARCHAR, 'Chalkboard XOR Game',
'You are given an array of integers nums represents the numbers written on 
a chalkboard. 
Alice and Bob take turns erasing exactly one number from the chalkboard, 
with Alice starting first. If erasing a number causes the bitwise XOR of all the 
elements of the chalkboard to become 0, then that player loses. The bitwise 
XOR of one element is that element itself, and the bitwise XOR of no 
elements is 0. 
Also, if any player starts their turn with the bitwise XOR of all the elements 
of the chalkboard equal to 0, then that player wins. 
Return true if and only if Alice wins the game, assuming both players play 
optimally. 

Example 1: 
Input: nums = [1,1,2] 
Output: false 
Explanation: 
Alice has two choices: erase 1 or erase 2. 
If she erases 1, the nums array becomes [1, 2]. The bitwise XOR of all the 
elements of the chalkboard is 1 XOR 2 = 3. Now Bob can remove any 
element he wants, because Alice will be the one to erase the last element 
and she will lose. 
If Alice erases 2 first, now nums become [1, 1]. The bitwise XOR of all the 
elements of the chalkboard is 1 XOR 1 = 0. Alice will lose. 
Example 2: 
Input: nums = [0,1] 
Output: true 
Example 3: 
Input: nums = [1,2,3] 
Output: true 

Constraints: 
• 1 <= nums.length <= 1000 
• 0 <= nums[i] < 2^16
', 'Brainteaser', 'Hard'),


(uuid_generate_v4()::VARCHAR, 'Trips and Users',
'SQL Schema 
Pandas Schema 
Table: Trips 
+-------------+----------+ 
| Column Name | Type     | 
+-------------+----------+ 
| id          | int      | 
| client_id   | int      | 
| driver_id   | int      | 
| city_id     | int      | 
| status      | enum     | 
| request_at  | date     | 
+-------------+----------+ 
id is the primary key (column with unique values) for this table. 
The table holds all taxi trips. Each trip has a unique id, while client_id and 
driver_id are foreign keys to the users_id at the Users table. 
Status is an ENUM (category) type of (''completed'', ''cancelled_by_driver'', 
''cancelled_by_client''). 
 
Table: Users 
+-------------+----------+ 
| Column Name | Type     | 
+-------------+----------+ 
| users_id    | int      | 
| banned      | enum     | 
| role        | enum     | 
+-------------+----------+ 
users_id is the primary key (column with unique values) for this table. 
The table holds all users. Each user has a unique users_id, and role is an 
ENUM type of (''client'', ''driver'', ''partner''). 
banned is an ENUM (category) type of (''Yes'', ''No''). 
 
The cancellation rate is computed by dividing the number of canceled (by 
client or driver) requests with unbanned users by the total number of 
requests with unbanned users on that day. 
Write a solution to find the cancellation rate of requests with unbanned 
users (both client and driver must not be banned) each day between "2013-
10-01" and "2013-10-03". Round Cancellation Rate to two decimal points. 
Return the result table in any order. 
The result format is in the following example. 
 
Example 1: 
Input: 
Trips table: 
+----+-----------+-----------+---------+---------------------+------------+
| id | client_id | driver_id | city_id |       status        | request_at |
+----+-----------+-----------+---------+---------------------+------------+
|  1 |     1     |     10    |    1    |     completed       | 2013-10-01 |
|  2 |     2     |     11    |    1    | cancelled_by_driver | 2013-10-01 |
|  3 |     3     |     12    |    6    |     completed       | 2013-10-01 |
|  4 |     4     |     13    |    6    | cancelled_by_client | 2013-10-01 |
|  5 |     1     |     10    |    1    |     completed       | 2013-10-02 |
|  6 |     2     |     11    |    6    |     completed       | 2013-10-02 |
|  7 |     3     |     12    |    6    |     completed       | 2013-10-02 |
|  8 |     2     |     12    |   12    |     completed       | 2013-10-03 |
|  9 |     3     |     10    |   12    |     completed       | 2013-10-03 |
| 10 |     4     |     13    |   12    | cancelled_by_driver | 2013-10-03 |
+----+-----------+-----------+---------+---------------------+------------+

Users table: 
+----------+--------+--------+
| users_id | banned |  role  |
+----------+--------+--------+
|    1     |   No   | client |
|    2     |   Yes  | client |
|    3     |   No   | client |
|    4     |   No   | client |
|   10     |   No   | driver |
|   11     |   No   | driver |
|   12     |   No   | driver |
|   13     |   No   | driver |
+----------+--------+--------+

Output: 
+------------+-------------------+
|    Day     | Cancellation Rate |
+------------+-------------------+
| 2013-10-01 |       0.33        |
| 2013-10-02 |       0.00        |
| 2013-10-03 |       0.50        |
+------------+-------------------+

Explanation: 
On 2013-10-01: 
 - There were 4 requests in total, 2 of which were canceled. 
 - However, the request with Id=2 was made by a banned client (User_Id=2), 
so it is ignored in the calculation. 
 - Hence there are 3 unbanned requests in total, 1 of which was canceled. 
 - The Cancellation Rate is (1 / 3) = 0.33 
On 2013-10-02: 
 - There were 3 requests in total, 0 of which were canceled. 
 - The request with Id=6 was made by a banned client, so it is ignored. 
 - Hence there are 2 unbanned requests in total, 0 of which were canceled. 
 - The Cancellation Rate is (0 / 2) = 0.00 
On 2013-10-03: 
 - There were 3 requests in total, 1 of which was canceled. 
 - The request with Id=8 was made by a banned client, so it is ignored. 
 - Hence there are 2 unbanned request in total, 1 of which were canceled. 
 - The Cancellation Rate is (1 / 2) = 0.50 
', 'Databases', 'Hard')
;