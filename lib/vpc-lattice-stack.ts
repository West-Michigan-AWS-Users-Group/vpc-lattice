import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './network';

export class VpcLatticeStack extends cdk.Stack {
  private readonly prefix = 'vpc-lattice';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userNetwork = new Network(this, 'user-network', {
      domain: 'user',
    });

    const appNetwork = new Network(this, 'app-network', {
      domain: 'app',
    });
  }
}
