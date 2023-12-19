export default interface TreeNode {
  id: string
  label: string
  children?: Array<TreeNode>
}