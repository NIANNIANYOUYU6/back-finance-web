#!/usr/bin/groovy
@Library('groot@master')
def version = determineVersion()

node {
    genericPipeline(
	version: version,

	build: {
            sh 'yarn --registry https://registry.npm.taobao.org'

            sh 'npm run build'

            buildImageViaRemote(projectName: getProjectName(),
                version: version,
                files: "dist Dockerfile nginx.conf");
       }
    )
}
