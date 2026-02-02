import React, { useEffect } from 'react';
import { createAnimatable } from 'animejs';
import { downloadTransition, startAnimation} from './index';

const launcherPath = ""; // TODO: ССЫЛКУ НА ЛАУНЧЕР СЮДААА

class MainPage extends React.Component {

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.handleLoad)
    }

    handleLoad() {
        setTimeout(() => { document.body.removeChild(document.getElementById('loader')); startAnimation(); }, 100)
    }


    render() {
        return (
            <div id="main-page" className="container">
                <div className="item panel">
                    {"Neque porro quisquam est qui dolorem ipsum "}
                </div>
                <div className="item panel">
                    {"Lorem ipsum dolor sit amet quia dolor sit amet, consectetur, adipisci"}
                </div>

                <div className="item card zero-start-scale">
                    <div className="card2" id="rect">

                        <h3>Список версий</h3>
                        <p>скачайте любую версию игры</p>

                        <DownloadButton onPageChange={this.props.onPageChange} />

                    </div>
                </div>
            </div>
        );
    }
}

class DownloadPage extends React.Component {
    render() {
        return (
            <div id="download-page">
                <h2 translate="no">Скачивание B-World</h2>

                <div className="launcher-container">
                    <div className="card big-af">
                        <div className="card2">
                            <p>Загрузите лаунчер со всеми версиями</p><br/> 
                            <p className="link">(рекомендовано)</p><br/>
                            <a margin-bottom="20px" href={launcherPath} className="sparkle-button">Скачать!</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const DownloadButton = ({ onPageChange }) => {
    useEffect(() => {
        const animatable = createAnimatable('#dBtn', {
            x: 500,
            y: 500,

        });

        const onMouseMove = (e) => {
            const rect = document.getElementById('rect').getBoundingClientRect(); // Исправлено: без параметра
            const x_ = (e.clientX - rect.left - rect.width / 2) / 6;
            const y_ = (e.clientY - rect.top - rect.height / 2) / 12;
            animatable.x(x_);
            animatable.y(y_);
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <div className="sp">
            <button
                className="sparkle-button"
                id="dBtn"
                onClick={() => {
                    setTimeout(onPageChange, 700, 1); // Используем переданный метод
                    downloadTransition();
                }}
            >
                <span className="spark"></span>
                <span className="backdrop"></span>
                <span className="text">Скачать</span>
            </button>
            <div className="bodydrop"></div>
        </div>
    );
}

///////////////////////////////////////////
class Content extends React.Component {
    state = { page: 0 };

    //static switchPage() { const a = () => {this.setState( {page: 1} );} }
    handlePageChange = (page) => {
        this.setState({ page });
    }

    render() {
        return (
            <div className="App-content">
                {(this.state.page === 0) ?
                    <MainPage onPageChange={this.handlePageChange} /> :
                    <DownloadPage onPageChange={this.handlePageChange} />}
            </div>
        );
    }
}

export default Content;
