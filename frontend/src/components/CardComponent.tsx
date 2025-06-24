import React from 'react';

interface CardComponentProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default CardComponent;