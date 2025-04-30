import Logo from '../../assets/logo_makro.png'
import Representante from '../../assets/representante_makro.png'
import '../Home/Home.css'
function Home() {
    return (
        <div className='tela_home'>
            <div className='header'>
                <div className='logo_makro'>
                    <img src={Logo} alt='Makro Logo'/>
                </div>
                <div className='img_representante'>
                    <img src={Representante} />
                </div>
            </div>
        </div>
    )
}

export default Home