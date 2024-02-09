import {
  AmazonLinuxCpuType,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  UserData,
} from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Network } from './network';
import { idPrefix } from './shared/constants';

interface ServerProps {
  network: Network;
}

export class Server extends Construct {
  public instance: Instance;

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id);

    const { network } = props;
    const domain = network.props.domain;

    const role = new Role(this, `${idPrefix}-${domain}-server-role`, {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      // inlinePolicies: {
      //   ['RetentionPolicy']: new PolicyDocument({
      //     statements: [
      //       new PolicyStatement({
      //         resources: ['*'],
      //         actions: ['logs:PutRetentionPolicy'],
      //       }),
      //     ],
      //   }),
      // },
      // managedPolicies: [
      //   ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      //   ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
      // ],
    });

    const userData = UserData.forLinux();
    userData.addCommands('yum update -y');

    this.instance = new Instance(this, `${idPrefix}-${domain}-server`, {
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.NANO),
      machineImage: MachineImage.latestAmazonLinux2({
        cachedInContext: false,
        cpuType: AmazonLinuxCpuType.X86_64,
      }),
      role,
      securityGroup: network.sg,
      userData,
      vpc: network.vpc,
    });
  }
}
