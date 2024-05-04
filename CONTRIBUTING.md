## Contributing to Penguins vs Dogs

Thank you for your interest in contributing to this project! We appreciate your time and effort. To ensure a smooth and productive experience for everyone, please follow these guidelines when contributing.

### Coding Style and Standards

* **ES6 Classes**: We use ES6 classes throughout the project. Make sure you are familiar with class syntax and concepts like `inheritance`, `constructors`, and `methods`.
* **Explicit Class Fields**: While working with JavaScript always explicitly declare class fields using the `class field declarations` syntax. Avoid using the constructor to define properties.
* **JSDoc Comments**: Document your code using JSDoc comments. This helps with understanding the purpose and usage of classes, methods, and properties. Refer to the `example below` for the expected style. Clearly define types for properties and function parameters within JSDoc comments.

### Example: Person Class
JavaScript (see [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)):
``` javascript
class Person {
    /** @type {string} */ name;
    /** @type {number} */ age;
    /** @type {string} */ #social_security_number; // private

    /**
     * Creates a new Person instance.
     * @param {string} name The person's name.
     * @param {number} age The person's age.
     */
    constructor(name, age) {
        this.name = name;
        this.age = age;
        // ...
    }

    /**
     * Returns a greeting message from the person.
     * @returns {string} The greeting message.
     */
    greet() {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}
```

TypeScript (see [docs](https://www.typescriptlang.org/docs/handbook/2/classes.html)):
``` typescript
class Person {
    public name: string;
    age: string; // 'public' may be omitted as it is default
    private social_security_number: string; // private

    /**
     * Creates a new Person instance.
     */
    constructor(name: string, age: string) {
        this.name = name;
        this.age = age;
    }

    /**
     * Returns a greeting message from the person.
     */
    greet() { // return type may be omitted as it it is automatically deduced
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}
```

### Contribution Workflow

1. Fork the repository: Create your own fork of the project repository.
2. Create a new branch: Branch off from the `master` branch for your feature or bug fix.
3. Make your changes: Implement your code following the coding style and standards mentioned above.
4. Test your changes: Ensure your code works as expected and doesn't introduce new issues.
5. Commit your changes: Write clear and concise commit messages that describe your changes.
6. Push to your fork: Push your changes to your forked repository.
7. Create a pull request: Submit a pull request containing a **detailed description of your work** to the `master` branch of the original repository.

### Additional Notes

* We encourage you to discuss your proposed changes through issues before starting work.
* Be sure to follow the project's code of conduct.
* We appreciate your contributions and will review your pull requests as soon as possible.

Thank you for your contributions!
