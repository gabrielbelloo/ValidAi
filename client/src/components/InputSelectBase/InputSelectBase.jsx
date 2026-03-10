import PropTypes from "prop-types";

export default function InputSelectBase({
  as: Component,
  name,
  label,
  required,
  placeholder,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-xs sm:text-[0.8em] xl:text-[0.9em] font-semibold text-white"
      >
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <div>
        {Component && (
          <Component placeholder={placeholder} id={name} name={name} {...props}
            className={`block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder-gray-500 focus:outline-2 
            focus:-outline-offset-2 focus:outline-gray-400 ${className}`}
          >
            {props.children}
          </Component>
        )}
      </div>
    </div>
  );
}

InputSelectBase.propTypes = {
  as: PropTypes.elementType,
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
};