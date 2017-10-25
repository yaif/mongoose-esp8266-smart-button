load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_aws.js');

let getInfo = function() {
    return JSON.stringify({total_ram: Sys.total_ram(), free_ram: Sys.free_ram()});
};

// Publish to MQTT topic on a button press. Button is wired to GPIO pin 0
GPIO.set_button_handler(0, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 2000, function() {
    let topic = '/devices/' + Cfg.get('device.id') + '/events';
    let message = getInfo();
    let ok = MQTT.pub(topic, message, 1);
    print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
}, null);

let button = Cfg.get('pin.button');
let events = {
    ev: 'pushed'
};
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
    let topic = '/Button/' + Cfg.get('device.id');
    let message = JSON.stringify(events);
    let ok = MQTT.pub(topic, message, 1);
    print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
}, null);

