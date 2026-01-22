import request from './apiClient'
import { FavoriteFoldersResponse } from '@/types/favorite'

export const getFavoriteFolders = (): Promise<FavoriteFoldersResponse> => {
  return request<FavoriteFoldersResponse>({
    endpoint: 'api/v1/favorite-folders/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Favorite Folders',
  })
}

export const addFavorite = (data: {
  propertyId: number
  folderId?: number
  folderName?: string
}): Promise<void> => {
  return request<void>({
    endpoint: 'api/v1/favorite-folders',
    method: 'POST',
    body: data,
    requiresAuth: true,
    errorContext: 'Add Favorite',
  })
}
