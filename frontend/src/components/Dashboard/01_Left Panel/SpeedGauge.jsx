import {GaugeComponent} from "react-gauge-component";

const SpeedGauge = ({ value, max = 100 }) => {
    const percentage = (value / max) * 180; // Convert to degrees

    return (
        <div className="relative">
            <GaugeComponent
                type="semicircle"
                arc={{
                    width: 0.2,
                    padding: 0.005,
                    cornerRadius: 1,
                    subArcs: [
                        {
                            limit: 25,
                            color: '#5BE12C',
                            showTick: true,
                        },
                        {
                            limit: 65,
                            color: '#F5CD19',
                            showTick: true,
                            // tooltip: {
                            //     text: 'Low temperature!'
                            // }
                        },
                        {
                            limit: 80,
                            color: '#EA4228',
                            showTick: true,
                        },
                    ]
                }}
                pointer={{
                    color: '#345243',
                    length: 0.80,
                    width: 15,
                }}
                labels={{
                    valueLabel: { formatTextValue: value => `${value}` },
                }}
                value={45}
                minValue={0}
                maxValue={80}
            />
            <div className="absolute w-full text-center -mt-6">
                <text>mph</text>
            </div>
        </div>

    );
};

export default SpeedGauge;
