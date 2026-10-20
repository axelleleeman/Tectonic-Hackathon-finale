import { useEffect, useState } from 'react'

/** Local object URL for a picked file; revoked when the file changes or the component unmounts. */
export function usePreviewUrl(file) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!file) { setUrl(null); return undefined }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}
