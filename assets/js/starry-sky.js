// Starry Sky Component for React pages
class StarrySky extends React.Component {
    state = {
        num: 60,
        vw: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        vh: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };

    componentDidMount() {
        this.updateStars();
        window.addEventListener('resize', this.updateStars);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateStars);
    }

    updateStars = () => {
        this.setState({
            vw: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            vh: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        });
    };

    getRandomX = () => Math.random() * this.state.vw;
    getRandomY = () => Math.random() * this.state.vh;
    randomRadius = () => Math.random() * 0.7 + 0.6;

    componentDidMount() {
        setTimeout(() => {
            anime({
                targets: ['.wish'],
                easing: 'linear',
                duration: 1300,
                delay: (el, i) => 1000 * i,
                opacity: [
                    { value: [0, 1], duration: 200 },
                    { value: [1, 0], duration: 1100 }
                ],
                width: [
                    { value: '0px', duration: 0 },
                    { value: '100px', duration: 800 },
                    { value: '0px', duration: 500 }
                ],
                translateX: {
                    value: '180px',
                },
                loop: true,
            });
        }, 1000);

        anime({
            targets: ['.message'],
            opacity: 1,
            duration: 1000,
            easing: 'easeOutExpo',
            delay: 1000,
        });

        anime({
            targets: ['.button'],
            opacity: 1,
            duration: 1000,
            easing: 'easeOutExpo',
            delay: 1000,
        });
    }

    render() {
        const { num } = this.state;
        return (
            <div>
                <svg id="sky">
                    {[...Array(num)].map((x, y) => (
                        <circle
                            cx={this.getRandomX()}
                            cy={this.getRandomY()}
                            r={this.randomRadius()}
                            stroke="none"
                            strokeWidth="0"
                            fill="white"
                            key={y}
                            className="star"
                        />
                    ))}
                </svg>
                <div id="shootingstars">
                    {[...Array(60)].map((x, y) => (
                        <div
                            key={y}
                            className="wish"
                            style={{
                                left: `${this.getRandomY()}px`,
                                top: `${this.getRandomX()}px`
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

// Export for use in other files
window.StarrySky = StarrySky;
