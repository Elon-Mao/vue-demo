export default interface MenuItem {
  id: number
  menuName: string
  files: Record<string, string>
  imports: Record<string, string>
}