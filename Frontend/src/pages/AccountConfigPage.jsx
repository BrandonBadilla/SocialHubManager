import '../styles/AccountConfigPage.css'
import BackButton from "../components/BackButton";

const AccountConfigPage = () => {
    return(
        <div>
            <div className="container-back-button">
                <BackButton 
                    label="Regresar" 
                    className="custom-back-btn" 
                    fallbackPath="/home"
                />
            </div>
            <h1>Configuración de Cuentas</h1>
            <div className="grid-divs-container">
                <div className="grid-div">
                    <img src="/images/linkedin.png" alt="LinkedIn" className="div-icon" />
                    LinkedIn
                    <label className="switch">
                        <input type="checkbox"/>
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="grid-div">
                    <img src="/images/mastodon.png" alt="Mastodon" className="div-icon" />
                    Mastodon
                    <label className="switch">
                        <input type="checkbox"/>
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default AccountConfigPage;