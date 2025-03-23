"use client"

export const downloadFile = async (url: string, filename: string) => {
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        const objectUrl = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = objectUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(objectUrl)
    } catch (error) {
        console.error("Erreur lors du téléchargement:", error)
        throw new Error("Impossible de télécharger le fichier")
    }
} 