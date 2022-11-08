import { readFileSync, writeFileSync } from 'fs';

/**
 * Genererer en ny package_comment.json fil, med kommentarer fra forrige versjon av package_comment.json
 */

const path = 'package_comment.json';
const { dependencies, devDependencies } = JSON.parse(readFileSync('package.json'));
const { dependencies: dependenciesComment, devDependencies: devDependenciesComment } = JSON.parse(
    readFileSync(path)
);

let newKeys = [];

const mergeComments = (current, previous) =>
    Object.keys(current).reduce((acc, key) => {
        const prevValue = previous[key];
        if (prevValue === undefined || prevValue === null) {
            newKeys.push(key);
        }
        acc[key] = prevValue || '';
        return acc;
    }, {});

const newPackageComment = {
    dependencies: mergeComments(dependencies, dependenciesComment),
    devDependencies: mergeComments(devDependencies, devDependenciesComment),
};
writeFileSync(path, JSON.stringify(newPackageComment, null, 2));

if (newKeys.length) {
    console.log('Nye dependencies mangler kommentarer', newKeys);
    process.exit(1);
}
