import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './network';
import { Server } from './server';

export class VpcLatticeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userNetwork = new Network(this, 'user-network', {
      domain: 'user',
    });
    const userServer = new Server(this, 'user-server', {
      network: userNetwork,
    });
    const appNetwork = new Network(this, 'app-network', {
      domain: 'app',
    });
  }
}
