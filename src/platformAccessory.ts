import type { PlatformAccessory, Service } from 'homebridge';

import type { HttpWaterLeakSensorPlatform } from './platform.js';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory the platform registers.
 */

export class HttpWaterLeakSensorPlatformAccessory
{
    constructor(private readonly platform: HttpWaterLeakSensorPlatform, private readonly accessory: PlatformAccessory)
    {
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)!
            .setCharacteristic(this.platform.Characteristic.Manufacturer, accessory.context.device.manufacturer || 'Device-Manufacturer')
            .setCharacteristic(this.platform.Characteristic.Model, accessory.context.device.model || 'Default-Model')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.serial || 'Default-Serial');

        const leakSensorService = this.accessory.context.device.status ? (this.accessory.getService('Leak Sensor') || this.accessory.addService(this.platform.Service.LeakSensor, 'Leak Sensor', 'Leak-Sensor')) : undefined;

        this.GetReadings(this.accessory.context.device, leakSensorService);

        setInterval(() =>
        {
            this.GetReadings(this.accessory.context.device, leakSensorService);
        }, accessory.context.device.updateInterval * 1000);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    async GetReadings(device: any, leakSensorService?: Service)
    {
        try
        {
            const response = await fetch(device.endpoint.url, { method: device.endpoint.method || 'GET', headers: device.endpoint.headers || {} });
            const data = await response.json();

            if (leakSensorService !== undefined)
            {
                const statusKey = device.status.key || 'status';
                const leakValue = device.status.leakValue || 'wet';
                const status = this.GetValueFromJson(data, statusKey)
                if (status !== undefined)
                {
                    leakSensorService.updateCharacteristic(this.platform.Characteristic.LeakDetected, status.toLowerCase() === leakValue.toLowerCase());
                }
            }
        }
        catch (error)
        {
            this.platform.log.info('An error occurred when getting readings:', error);
        }
    }

    GetValueFromJson(jsonData: any, keyPath: string)
    {
        const keys = keyPath.split('.');

        return keys.reduce((previous, key) =>
        {
            if (previous && Object.hasOwn(previous, key))
            {
                return previous[key];
            }

            return undefined;
        }, jsonData);
    }
}