// Google Drive API Integration
// Fetches portfolio categories and files from a public Google Drive folder

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const ROOT_FOLDER_ID = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || '';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  imageMediaMetadata?: {
    width: number;
    height: number;
  };
  // Optional server-provided card thumbnail (e.g. thumbnail.png inside a folder)
  cardThumbnail?: string;
}

export interface Category {
  id: string;
  name: string;
  fileCount: number;
  thumbnail: string | null;
  files?: DriveFile[];
}

// Fetch all subfolders (categories) from the root portfolio folder
export async function getCategories(): Promise<Category[]> {
  if (!API_KEY || !ROOT_FOLDER_ID) {
    return getDemoCategories();
  }

  try {
    const url = `${DRIVE_API_BASE}/files?q='${ROOT_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${API_KEY}&fields=files(id,name)&orderBy=name`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    if (!data.files) return getDemoCategories();

    const categories: Category[] = await Promise.all(
      data.files.map(async (folder: { id: string; name: string }) => {
        const allFiles = await getRawFolderContents(folder.id);
        const thumbnailFile = allFiles.find(isThumbnailFile) || null;
        const visibleFiles = allFiles.filter(file => !isThumbnailFile(file));
        const actualFiles = visibleFiles.filter(file => !isFolder(file));
        const thumbnail = thumbnailFile
          ? getFileThumbnail(thumbnailFile.id)
          : actualFiles.length > 0
          ? getFileThumbnail(actualFiles[0].id)
          : null;

        return {
          id: folder.id,
          name: folder.name,
          fileCount: actualFiles.length,
          thumbnail,
        };
      })
    );

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return getDemoCategories();
  }
}

// Fetch all items (files AND folders) inside a folder — does NOT recurse
const THUMBNAIL_FILENAME = 'thumbnail.webp';

export function isThumbnailFile(file: DriveFile): boolean {
  return file.name?.toLowerCase() === THUMBNAIL_FILENAME;
}

export async function getRawFolderContents(folderId: string): Promise<DriveFile[]> {
  if (!API_KEY) return [];

  try {
    // Fetch both files and folders, ordered: folders first, then files
    const url = `${DRIVE_API_BASE}/files?q='${folderId}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,createdTime,modifiedTime,size,imageMediaMetadata)&orderBy=folder,name&pageSize=100`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    return data.files || [];
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    return [];
  }
}

export async function getFolderContents(folderId: string): Promise<DriveFile[]> {
  const allFiles = await getRawFolderContents(folderId);
  return allFiles.filter(file => !isThumbnailFile(file));
}

// Check if a Drive item is a folder
export function isFolder(file: DriveFile): boolean {
  return file.mimeType === 'application/vnd.google-apps.folder';
}

// Backward-compatible alias
export async function getCategoryFiles(folderId: string): Promise<DriveFile[]> {
  return getFolderContents(folderId);
}

// Get a direct viewable URL for a Google Drive image (uses local API proxy)
export function getFileUrl(fileId: string): string {
  return `/api/drive-file/${fileId}`;
}

// Get thumbnail URL (for smaller previews — uses local API proxy)
export function getFileThumbnail(fileId: string): string {
  return `/api/drive-file/${fileId}`;
}

// Get embeddable preview URL (for videos and PDFs — uses Google Drive embed)
export function getFilePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Get download URL
export function getFileDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Determine file type category
export function getFileType(mimeType: string): 'image' | 'video' | 'pdf' | 'other' {
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('video')) return 'video';
  if (mimeType.includes('pdf')) return 'pdf';
  return 'other';
}

// Get category/folder details with its contents (both folders and files)
export async function getCategoryWithFiles(categoryId: string): Promise<Category | null> {
  if (!API_KEY || !ROOT_FOLDER_ID) {
    return getDemoCategoryWithFiles(categoryId);
  }

  try {
    // Get folder info
    const folderUrl = `${DRIVE_API_BASE}/files/${categoryId}?key=${API_KEY}&fields=id,name`;
    const folderRes = await fetch(folderUrl, { next: { revalidate: 60 } });
    const folder = await folderRes.json();

    // Get all items inside this folder (folders + files), excluding thumbnail.png
    const allItems = await getRawFolderContents(categoryId);
    const thumbnailFile = allItems.find(isThumbnailFile) || null;
    const visibleItems = allItems.filter(item => !isThumbnailFile(item));

    // Count only actual files (not subfolders) for the badge
    const actualFiles = visibleItems.filter(item => !isFolder(item));

    // For any subfolder items, check inside them for their own thumbnail.png
    // and attach it as `cardThumbnail` so the UI can render a background image.
    for (const item of visibleItems) {
      if (isFolder(item)) {
        try {
          const childItems = await getRawFolderContents(item.id);
          const thumb = childItems.find(isThumbnailFile) || null;
          if (thumb) {
            // Attach a proxied thumbnail URL for the folder card
            (item as any).cardThumbnail = getFileThumbnail(thumb.id);
          }
        } catch (e) {
          // ignore per-folder errors
        }
      }
    }

    const firstFile = actualFiles.length > 0 ? actualFiles[0] : null;

    return {
      id: folder.id,
      name: folder.name,
      fileCount: actualFiles.length,
      thumbnail: thumbnailFile
        ? getFileThumbnail(thumbnailFile.id)
        : firstFile
        ? getFileThumbnail(firstFile.id)
        : null,
      files: visibleItems, // contains both folders and files, but excludes thumbnail.png
    };
  } catch (error) {
    console.error('Error fetching category with files:', error);
    return null;
  }
}

// ===== DEMO DATA (Fallback when no API key is configured) =====

const DEMO_CATEGORIES: Category[] = [
  // {
  //   id: 'demo-3d-product',
  //   name: '3D Product Design',
  //   fileCount: 8,
  //   thumbnail: null,
  // },
  // {
  //   id: 'demo-branding',
  //   name: 'Branding',
  //   fileCount: 12,
  //   thumbnail: null,
  // },
  // {
  //   id: 'demo-motion',
  //   name: 'Motion Graphics',
  //   fileCount: 6,
  //   thumbnail: null,
  // },
  // {
  //   id: 'demo-logo',
  //   name: 'PixelCube Logo',
  //   fileCount: 4,
  //   thumbnail: null,
  // },
  // {
  //   id: 'demo-social',
  //   name: 'Social Media',
  //   fileCount: 15,
  //   thumbnail: null,
  // },
  {
    id: 'demo-uiux',
    name: 'UI/UX Product Design',
    fileCount: 10,
    thumbnail: null,
  },
  {
    id: 'demo-webapp',
    name: 'Web App',
    fileCount: 7,
    thumbnail: null,
  },
  {
    id: 'demo-yt-thumb',
    name: 'Youtube Thumbnails',
    fileCount: 20,
    thumbnail: null,
  },
  {
    id: 'demo-yt-video',
    name: 'Youtube Videos',
    fileCount: 5,
    thumbnail: null,
  },
];

function getDemoCategories(): Category[] {
  return DEMO_CATEGORIES;
}

function getDemoCategoryWithFiles(categoryId: string): Category | null {
  const category = DEMO_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  // Generate demo files
  const demoFiles: DriveFile[] = Array.from({ length: category.fileCount }, (_, i) => ({
    id: `${categoryId}-file-${i + 1}`,
    name: `${category.name} Project ${i + 1}`,
    mimeType: 'image/jpeg',
    createdTime: new Date().toISOString(),
  }));

  return { ...category, files: demoFiles };
}

export function isDemoMode(): boolean {
  return !API_KEY || !ROOT_FOLDER_ID;
}
