
// RatchetReact is a simplified React clone.
// It is meant to have a familiar syntax but much simplified.
// v1.1

window.onload = () => {
	RatchetReact.Reload();
}

class RatchetReact<T extends HTMLElement> {
	private htmlElem: T;
	private isOpen: boolean;

	public static Root: RatchetReact<HTMLElement>;

	/**
	 * Initializes the document with the root node
	 */
	public static Reload(): void {
		if (document.body && RatchetReact.Root !== undefined) {
			document.body.replaceChildren(RatchetReact.Root.elem());
		}
	}

	public static Get<T extends HTMLElement>(id: string): RatchetReact<T> | null {
		const elem = document.getElementById(id);
		if (elem === null) return null;
		return new RatchetReact<T>(elem as T);
	}

	/**
	 * Creates a RatchetReact element out of the given HTML element.
	 * @param htmlElem Existing element to create wrapper for.
	 */
	public constructor(htmlElem: T) {
		this.htmlElem = htmlElem;
		this.isOpen = false;
	}

	/**
	 * Creates a new RatchetReact element.
	 * @param tagName HTML tag.
	 * @returns New RatchetReact element.
	 */
	public static New<K extends keyof HTMLElementTagNameMap>(tagName: K): RatchetReact<HTMLElementTagNameMap[K]> {
		return new RatchetReact<HTMLElementTagNameMap[K]>(document.createElement(tagName));
	}

	/**
	 * Appends a new RatchetReact element.
	 * @param elem HTML tag of element to create.
	 * @returns Newly-appended RatchetReact element.
	 */
	public add<K extends keyof HTMLElementTagNameMap>(elem: K): RatchetReact<HTMLElementTagNameMap[K]> {
		return this.addRef(RatchetReact.New(elem));
	}

	/**
	 * Appends an existing RatchetReact element.
	 * @param elem Existing RatchetReact element.
	 * @returns Newly-appended RatchetReact element.
	 */
	public addRef<K extends HTMLElement>(elem: RatchetReact<K>): RatchetReact<K> {
		if (this.isOpen) {
			this.htmlElem.appendChild(elem.htmlElem);
		}
		else {
			if (this.htmlElem.parentElement === null) throw this;
			this.htmlElem.parentElement.appendChild(elem.htmlElem);
		}
		return elem;
	}

	/**
	 * Appends an async RatchetReact element.
	 * @param elem Promise of RatchetReact element.
	 * @returns Placeholder element.
	 */
	public addAsync<K extends HTMLElement>(elem: Promise<RatchetReact<K>>): RatchetReact<HTMLElement> {
		const placeholder = new RatchetReact<HTMLElement>(document.createElement("div"));
		const isOpenCopy = this.isOpen;
		this.addRef(placeholder);
		elem.then((elem) => {
			for (const child of placeholder.htmlElem.childNodes) {
				elem.htmlElem.appendChild(child);
			}

			if (isOpenCopy) {
				this.htmlElem.replaceChild(elem.htmlElem, placeholder.htmlElem);
			}
			else {
				if (this.htmlElem.parentElement === null) throw this;
				this.htmlElem.parentElement.replaceChild(elem.htmlElem, placeholder.htmlElem);
			}
			placeholder.htmlElem = elem.htmlElem;
		});
		return placeholder;
	}

	/**
	 * Appends raw HTML to the underlying HTML.
	 * @param rawHtml HTML to append.
	 * @returns This RatchetReact element.
	 */
	public addRaw(rawHtml: string): RatchetReact<T> {
		if (this.isOpen) {
			this.htmlElem.insertAdjacentHTML("beforeend", rawHtml);
		}
		else {
			if (this.htmlElem.parentElement === null) throw this;
			this.htmlElem.insertAdjacentHTML("afterend", rawHtml);
		}
		return this;
	}

	/**
	 * "Opens" the RatchetReact element.
	 * Signifies that add() should append the next element as a child.
	 * @returns This RatchetReact element.
	 */
	public open(): RatchetReact<T> {
		this.isOpen = true;
		return this;
	}

	/**
	 * "Closes" the RatchetReact element.
	 * @returns Parent RatchetReact element.
	 */
	public close(): RatchetReact<HTMLElement> {
		if (this.isOpen) {
			this.isOpen = false;
			return this;
		}
		else {
			if (this.htmlElem.parentElement === null) throw this;
			return new RatchetReact<HTMLElement>(this.htmlElem.parentElement);
		}
	}

	/**
	 * Sets a property on the underlying HTML element.
	 * @param property Property to set.
	 * @param value Value to set property to.
	 * @returns This RatchetReact element.
	 */
	public set<K extends keyof T>(property: K, value: T[K]): RatchetReact<T> {
		this.htmlElem[property] = value;
		return this;
	}

	/**
	 * Sets an attribute on the underlying HTML element.
	 * @param property Attribute to set.
	 * @param value Value to set attribute to.
	 * @returns This RatchetReact element.
	 */
	public setRaw(property: string, value: string): RatchetReact<T> {
		this.htmlElem.setAttribute(property, value);
		return this;
	}

	/**
	 * Gets a property on the underlying HTML element.
	 * @param property Property to get value of.
	 * @returns Value of property.
	 */
	public get<K extends keyof T>(property: K): T[K] {
		return this.elem()[property];
	}

	/**
	 * Get the underlying HTML element.
	 * @returns HTML element.
	 */
	public elem(): T {
		return this.htmlElem;
	}
}