import { readFileSync, writeFileSync } from 'fs';

/**
 * Genererer en ny package_comment.json fil, med kommentarer fra forrige versjon av package_comment.json
 */

const path = 'package_comment.json';
const { dependencies, devDependencies } = JSON.parse(readFileSync('package.json'));
const { dependencies: dependenciesComment, devDependencies: devDependenciesComment } = JSON.parse(
    readFileSync(path)
);

const mergeComments = (packagePart, commentPart) =>
    Object.keys(packagePart).reduce((acc, curr) => {
        acc[curr] = commentPart[curr] || '';
        return acc;
    }, {});

const newPackageComment = {
    dependencies: mergeComments(dependencies, dependenciesComment),
    devDependencies: mergeComments(devDependencies, devDependenciesComment),
};
writeFileSync(path, JSON.stringify(newPackageComment, null, 2));
