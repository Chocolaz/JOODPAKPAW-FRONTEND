export interface FavoriteFolder {
  id: number
  name: string
  propertyCount: number
  firstPropertyImage: string
  createdAt: string
}

export interface FavoriteFoldersResponse {
  favoriteFolders: FavoriteFolder[]
}
