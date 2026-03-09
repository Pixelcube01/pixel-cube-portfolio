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
        const files = await getCategoryFiles(folder.id);
        const thumbnail = files.length > 0 ? getFileThumbnail(files[0].id) : null;

        return {
          id: folder.id,
          name: folder.name,
          fileCount: files.length,
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

// Fetch all files inside a specific category folder
export async function getCategoryFiles(folderId: string): Promise<DriveFile[]> {
  if (!API_KEY) return [];

  try {
    const url = `${DRIVE_API_BASE}/files?q='${folderId}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,createdTime,modifiedTime,size,imageMediaMetadata)&orderBy=name&pageSize=100`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    return data.files || [];
  } catch (error) {
    console.error('Error fetching category files:', error);
    return [];
  }
}

// Get a direct viewable URL for a Google Drive image
export function getFileUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

// Get thumbnail URL (for smaller previews)
export function getFileThumbnail(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w800`;
}

// Get embeddable preview URL (for videos and PDFs)
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

// Get category details with files
export async function getCategoryWithFiles(categoryId: string): Promise<Category | null> {
  if (!API_KEY || !ROOT_FOLDER_ID) {
    return getDemoCategoryWithFiles(categoryId);
  }

  try {
    // Get folder info
    const folderUrl = `${DRIVE_API_BASE}/files/${categoryId}?key=${API_KEY}&fields=id,name`;
    const folderRes = await fetch(folderUrl, { next: { revalidate: 60 } });
    const folder = await folderRes.json();

    // Get files
    const files = await getCategoryFiles(categoryId);

    return {
      id: folder.id,
      name: folder.name,
      fileCount: files.length,
      thumbnail: files.length > 0 ? getFileThumbnail(files[0].id) : null,
      files,
    };
  } catch (error) {
    console.error('Error fetching category with files:', error);
    return null;
  }
}

// ===== DEMO DATA (Fallback when no API key is configured) =====

const DEMO_CATEGORIES: Category[] = [
  {
    id: 'demo-3d-product',
    name: '3D Product Design',
    fileCount: 8,
    thumbnail: null,
  },
  {
    id: 'demo-branding',
    name: 'Branding',
    fileCount: 12,
    thumbnail: null,
  },
  {
    id: 'demo-motion',
    name: 'Motion Graphics',
    fileCount: 6,
    thumbnail: null,
  },
  {
    id: 'demo-logo',
    name: 'PixelCube Logo',
    fileCount: 4,
    thumbnail: null,
  },
  {
    id: 'demo-social',
    name: 'Social Media',
    fileCount: 15,
    thumbnail: null,
  },
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
