import { fromIni } from "@aws-sdk/credential-provider-ini";
import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

const isLocal = process.env.NODE_ENV !== "production";

const ssm = new SSMClient({
    region: "us-west-1",
});

export const loadConfigFromSSM = async (app, serviceNames) => {
    const results = await Promise.all(serviceNames.map(async (service) => {
        const command = new GetParametersByPathCommand({
            Path: `/${app}/${service}/`,
            WithDecryption: true
        });

        const response = await ssm.send(command);
        const config = {};

        for (const param of response.Parameters) {
            const key = param.Name.split("/").pop();
            config[key] = param.Value;
        }

        return config;
    }));

    return results.reduce((acc, cur) => ({ ...acc, ...cur }), {});
};
