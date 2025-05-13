import Image from "next/image"

interface TreeVisualizationProps {
  progressPercentage: number
}

export function TreeVisualization({ progressPercentage }: TreeVisualizationProps) {
  // Determine which tree image to show based on progress percentage
  const getTreeImage = () => {
    const roundedPercentage = Math.floor(progressPercentage / 10) * 10
    return `/trees/tree-${roundedPercentage}.png`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
        <Image
          src={getTreeImage() || "/placeholder.svg"}
          alt={`Árbol de progreso al ${progressPercentage}%`}
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
      <p className="text-sm text-center text-muted-foreground mt-2">
        {progressPercentage < 25 && "¡Tu árbol está comenzando a crecer! Sigue nutriéndolo."}
        {progressPercentage >= 25 &&
          progressPercentage < 50 &&
          "¡Las primeras hojas están brotando! Vas por buen camino."}
        {progressPercentage >= 50 && progressPercentage < 75 && "¡Tu árbol está creciendo fuerte! Mantén el impulso."}
        {progressPercentage >= 75 &&
          progressPercentage < 100 &&
          "¡Tu árbol está casi en su esplendor! La meta está cerca."}
        {progressPercentage >= 100 && "¡Felicidades! Tu árbol ha florecido completamente. ¡Objetivo cumplido!"}
      </p>
    </div>
  )
}
