export function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result as string
      resolve(result)
    }

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"))
    }

    reader.readAsDataURL(file)
  })
}

export function deleteImage(url: string): boolean {
  // En un sistema real, aquí se eliminaría la imagen del storage
  return true
}
