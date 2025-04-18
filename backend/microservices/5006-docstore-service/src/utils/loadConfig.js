import { fromIni } from "@aws-sdk/credential-provider-ini";
import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

const isLocal = process.env.NODE_ENV !== "production";

const ssm = new SSMClient({
    region: "us-west-1",
    credentials: isLocal ? fromIni({ profile: "default" }) : undefined,
});

export const loadConfigFromSSM = async (serviceNames) => {
    await Promise.all(serviceNames.map(async (service) => {
        const command = new GetParametersByPathCommand({
            Path: `/microservices/${ service }/`,
            WithDecryption: true
        });

        const response = await ssm.send(command);

        const config = {};
        for (const param of response.Parameters) {
            const key = param.Name.split("/").pop();
            config[key] = param.Value;
        }

        // Inject into environment
        Object.assign(process.env, config);
        console.log(`[SSM] Loaded ${ Object.keys(config).length } config values for ${ service }`);
    }))
};
