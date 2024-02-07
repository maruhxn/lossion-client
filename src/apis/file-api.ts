/* FILE API */

export const GET_FILE_URL = (fileName: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/files/${fileName}`;
