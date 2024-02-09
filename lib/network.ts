import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { idPrefix } from './shared/constants';

interface NetworkProps {
  domain: 'app' | 'user';
}

export class Network extends Construct {
  public props: NetworkProps;
  public sg: SecurityGroup;
  public vpc: Vpc;

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);
    this.props = props;

    const { domain } = props;
    this.vpc = new Vpc(this, `${idPrefix}-${domain}`, {
      availabilityZones: ['us-east-1a'],
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: `${idPrefix}-${domain}-private-1`,
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    this.sg = new SecurityGroup(this, `${idPrefix}-${domain}-sg-1`, {
      allowAllOutbound: true,
      description: '',
      vpc: this.vpc,
    });
  }
}
