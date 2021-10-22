import dynamic from 'next/dynamic'
const Snake = dynamic(() => import('../components/Snake'), {
  ssr: false
})

export default function Home() {  
  return (
    <Snake />
  )
}
