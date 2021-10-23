import dynamic from 'next/dynamic'
import Footer from '../components/Footer'
const Snake = dynamic(() => import('../components/Snake'), {
  ssr: false
})

export default function Home() {  
  return (
    <>
      <Snake />
      <Footer />
    </>
  )
}
